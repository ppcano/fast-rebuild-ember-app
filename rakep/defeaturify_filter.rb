class EmberDefeatureifyFilter < Rake::Pipeline::Filter
  def defeatureify(input, strib_debug = false)

    features_file_name = 'ember_features.json'


    if File.exists?(features_file_name) && File.exists?('node_modules/.bin/defeatureify')
      options = " --stripdebug " if strib_debug
      `./node_modules/.bin/defeatureify #{input.fullpath} --config #{features_file_name} #{options}`
    else
      input.read
    end
  end

  def generate_output(inputs, output)
    inputs.each do |input|
      output.write defeatureify(input)
    end
  end
end
