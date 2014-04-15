require 'execjs'
require 'json'

require "rake-pipeline-web-filters"

# Based on https://github.com/wycats/rake-pipeline-web-filters/blob/master/lib/rake-pipeline-web-filters/es6_module_filter.rb
# Add es-6-node-runner.js to /support folder  
# es6-module-transpiler npm package must be loaded (this is the only difference with the es6_module_filter which uses the local es6-module-transpiler library)
module RubyES6

  class << self

    attr_accessor :js_code

    
    # accepts amd, cjs, yui, or global.  defaults to amd.
    def transpile(code, options = {})
      @js_code = code
      runtime.exec(generate_source(options))
    end

    private

      def runtime

        @runtime ||= ExecJS::ExternalRuntime.new(
          name:        "Node.js (V8)",
          command:     ["nodejs", "node"],
          #runner_path: ExecJS.root + "/support/node_runner.js", #FAILS
          runner_path:  File.expand_path('./rakep/support/es6-node-runner.js'),
          encoding:    'UTF-8'
        )

      end

      def generate_source(options)
					contents = <<END
          var Compiler, compiler, output;
          Compiler = require('es6-module-transpiler').Compiler;
          compiler = new Compiler(#{::JSON.generate(@js_code, quirks_mode: true)}, '#{module_name(options)}', #{options.to_json});
          return output = compiler.#{compiler_type(options)}();
END
      end

      def compiler_type(options)
        available_types = {
          amd: 'AMD',
          cjs: 'CJS',
          yui: 'YUI',
          globals: 'Globals'
        }

        if options[:type]
          type = available_types[options[:type].downcase.to_sym] || 'AMD'
        else
          type = 'AMD'
        end

        "to#{type}"
      end

      def module_name(options)
        options[:moduleName]
      end
  end

  class RakeFilter < Rake::Pipeline::Filter
    attr_reader :options

    # Create an instance of this filter.
    #
    # Possible options:
    # module_id_generator: provide a Proc to convert an input to a
    #                      module identifier (AMD only)
    # Other options are passed along to the RubyES6ModuleTranspiler and then to
    #  the node transpiler. See https://github.com/square/es6-module-transpiler
    #  for more info.
    #
    # @param [Hash] options options (see above)
    # @param [Proc] block the output name generator block
    def initialize(options = {}, &block)
      @module_id_generator = options[:module_id_generator]
      super(&block)
      @options = options
    end

    # The body of the filter. Compile each input file into
    # a ES6 Module Transpiled output file.
    #
    # @param [Array] inputs an Array of FileWrapper objects.
    # @param [FileWrapper] output a FileWrapper object
    def generate_output(inputs, output)
      inputs.each do |input|
        begin
          body = input.read if input.respond_to?(:read)
          local_opts = {}
          if @module_id_generator
            local_opts[:moduleName] = @module_id_generator.call(input)
          end
          #puts "transpile: " << local_opts[:moduleName]
          opts = @options.merge(local_opts)
          opts.delete(:module_id_generator)
          output.write RubyES6.transpile(body, opts)
        rescue ExecJS::Error => error
          raise error, "Error compiling #{input.path}. #{error.message}"
        end
      end
    end

  end


  ENV['NODE_PATH'] = [
    File.expand_path('node_modules'),
    File.expand_path('vendor/node_modules'),
    ENV['NODE_PATH']
  ].join(File::PATH_SEPARATOR)

end



