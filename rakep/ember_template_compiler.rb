

class EmberTemplateCompiler
  class << self 
    def generate(inputPath, outputPath)

      file_content = File.read(inputPath)
      file_content.gsub!('import Ember from "ember-metal/core";', '')
      file_content.gsub!('export default EmberHandlebars;', '')

      out = "(function() {\nvar Ember = { assert: function() {}, FEATURES: { isEnabled: function() {} } };\n"
      out << file_content
      out << "\nexports.precompile = EmberHandlebars.precompile;"
      out << "\nexports.EmberHandlebars = EmberHandlebars;"
      out << "\n})();"

      File.open(outputPath, 'w') do |file| 
        file.write(out) 
      end

    end
  end
end
