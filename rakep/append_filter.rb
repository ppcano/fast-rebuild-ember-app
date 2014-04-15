class AppendFilter < Rake::Pipeline::Filter

  def initialize(options={}, &block)
    super(&block)
    @before = options[:before]
    @path = options[:path]
    @content = options[:content]
  end
  def generate_output(inputs, output)

    content = @content || File.read(File.expand_path(@path))

    output.write content if @before
    inputs.each do |input|
      output.write input.read
    end
    output.write content unless @before

  end
end
