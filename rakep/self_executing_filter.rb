
class SelfExecutingFilter < Rake::Pipeline::Filter
  def generate_output(inputs, output)
    output.write "(function() {\n"
    
    inputs.each do |input|
      output.write input.read
    end

    output.write "\n})();\n"
  end
end

