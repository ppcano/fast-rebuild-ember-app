require "execjs"

module Rakep

  class AddHandlebarsDependencies < Rake::Pipeline::Filter

    def generate_output(inputs, output)

					contents = <<END
 minispade.require('ember-metal');
 minispade.require('rsvp');
 minispade.require('container');
 minispade.require('ember-debug');
 minispade.require('ember-runtime');
 minispade.require('ember-routing');
 minispade.require('ember-application');
 minispade.require('ember-views');
 minispade.require('metamorph');
 minispade.require('ember-handlebars');
END

      output.write contents

      inputs.each do |input|
        output.write input.read
      end

		end

	end

  class AddMicroLoader < Rake::Pipeline::Filter

    def initialize(options={}, &block)
      super(&block)
      @global = options[:global]
    end

    def generate_output(inputs, output)
      output.write "(function() {\n" unless @global


      

      output.write File.read("./app/submodules/ember.js/packages/loader/lib/main.js")

      inputs.each do |input|
        output.write input.read
      end

      output.write "\n})();\n" unless @global
    end

  end

  class EmberStub < Rake::Pipeline::Filter
    def generate_output(inputs, output)
      inputs.each do |input|
        file = File.read(input.fullpath)
        out = "(function() {\nvar Ember = { assert: function() {}, FEATURES: { isEnabled: function() {} } };\n"

        out << file
        out << "\nexports.precompile = Ember.Handlebars.precompile;"
        out << "\nexports.EmberHandlebars = Ember.Handlebars;"
        out << "\n})();"
        output.write out
      end
    end
  end

  class EmberProductionFilter < Rake::Pipeline::Filter
    def generate_output(inputs, output)
      inputs.each do |input|
        result = File.read(input.fullpath)
        result.gsub!(%r{^(\s)+ember_(assert|deprecate|warn)\((.*)\).*$}, "")
        output.write result
      end
    end
  end

  class CustomHandlebarsPrecompiler < Rake::Pipeline::Filter
    class << self
      def context
        unless @context
          contents = <<END
exports = {};
function require() {
  #{File.read("app/vendor/precompile/handlebars-v1.3.0.js")};
  return Handlebars;
}

#{File.read("tmp/source/ember-template-compiler.js")}
function precompileEmberHandlebars(string) {
  return exports.precompile(string).toString();
}
END
          @context = ExecJS.compile(contents)
        end
        @context
      end
    end


    def initialize(options={}, &block)
      super(&block)
      @inline = options[:inline]
      @base_path = options[:base_path]
    end

    def precompile_inline_templates(data)
       data.gsub!(%r{(defaultTemplate(?:\s*=|:)\s*)precompileTemplate\(['"](.*)['"]\)}) do
         "#{$1}Ember.Handlebars.template(#{self.class.context.call("precompileEmberHandlebars", $2)})"
       end
    end

    def precompile_hbs_templates(name, data)
     "\nEmber.TEMPLATES['#{name}'] = Ember.Handlebars.template(#{self.class.context.call("precompileEmberHandlebars", data)});\n"
    end

    def generate_output(inputs, output)

      inputs.each do |input|
        result = File.read(input.fullpath)
        if @inline 
          # TODO: fails
          #precompile_inline_templates(result)
        else 
          name = File.basename(input.path, '.handlebars')
          result = precompile_hbs_templates(name, result)
        end
        output.write result
      end
    end
  end

end
