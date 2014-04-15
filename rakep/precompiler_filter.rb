require "execjs"

class HandlebarsPrecompilerFilter < Rake::Pipeline::Filter

  class << self
    def configure(compiler_path, handlebars_path)
      contents = <<END
exports = {};

// ember-template-compiler node module needs to `require('handlebars')`. 
function require() {
#{File.read(handlebars_path)};
return Handlebars;
}

#{File.read(compiler_path)}
function precompileEmberHandlebars(string) {
return exports.precompile(string).toString();
}
END
      @context = ExecJS.compile(contents)
    end

    def context
      @context
    end
  end


  def initialize(options={}, &block)
    super(&block)
    @is_inline = options[:is_inline]
    @template_path_root = options[:template_path_root]
  end

  def precompile_inline_templates(data)
    # Precompile defaultTemplates
   data.gsub!(%r{(defaultTemplate(?:\s*=|:)\s*)precompileTemplate\(['"](.*)['"]\)}) do
     "#{$1}Ember.Handlebars.template(#{self.class.context.call("precompileEmberHandlebars", $2)})"
   end
  end

  def precompile_hbs_templates(template_name, data)
   #puts "TEMPLATE: " << template_name
   "\nEmber.TEMPLATES['#{template_name}'] = Ember.Handlebars.template(#{self.class.context.call("precompileEmberHandlebars", data)});\n"
  end

  def generate_output(inputs, output)
    inputs.each do |input|

      result = File.read(input.fullpath)
      if @is_inline 
        precompile_inline_templates(result)
      else 

        # prepare template_name to be accesible with  DefaultResolver
        template_name = input.path.gsub(@template_path_root,'') if @template_path_root
        template_name = template_name.chomp(File.extname(template_name))

        result = precompile_hbs_templates(template_name, result)
      end
      output.write result

    end
  end
end
