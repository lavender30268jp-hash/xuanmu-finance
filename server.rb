require 'webrick'
require 'json'
require 'fileutils'

DATA_FILE = File.join(__dir__, 'data.json')

class SyncServlet < WEBrick::HTTPServlet::AbstractServlet
  def do_GET(req, res)
    res.status = 200
    res['Content-Type'] = 'application/json'
    res['Access-Control-Allow-Origin'] = '*'
    res['Access-Control-Allow-Headers'] = 'Content-Type'
    if File.exist?(DATA_FILE)
      res.body = File.read(DATA_FILE)
    else
      res.body = { status: 'empty' }.to_json
    end
  end

  def do_POST(req, res)
    res.status = 200
    res['Content-Type'] = 'application/json'
    res['Access-Control-Allow-Origin'] = '*'
    res['Access-Control-Allow-Headers'] = 'Content-Type'
    body_data = req.body
    if body_data && !body_data.empty?
      File.write(DATA_FILE, body_data)
    end
    res.body = { status: 'success', time: Time.now.to_i }.to_json
  end

  def do_OPTIONS(req, res)
    res.status = 200
    res['Access-Control-Allow-Origin'] = '*'
    res['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    res['Access-Control-Allow-Headers'] = 'Content-Type'
    res.body = ''
  end
end

server = WEBrick::HTTPServer.new(:Port => 8080, :DocumentRoot => __dir__)
server.mount('/api/sync', SyncServlet)

trap('INT') { server.shutdown }
server.start
