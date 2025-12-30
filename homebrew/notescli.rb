class Notescli < Formula
  desc "Create and Read Apple Notes via CLI"
  homepage "https://github.com/wilbertliu/notescli"
  version "0.2.0"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/wilbertliu/notescli/releases/download/v#{version}/notescli-#{version}-darwin-arm64.tar.gz"
      sha256 "2b09f392e8524628e9eb49550a953adfa5a19e7874364c1d9a396bc692d089e9"
    else
      url "https://github.com/wilbertliu/notescli/releases/download/v#{version}/notescli-#{version}-darwin-x64.tar.gz"
      sha256 "4c813e769afe5011de672fabdcc1aeaf97a7722b00e99502684a762a40fac999"
    end
  end

  def install
    bin.install "notescli"
  end

  test do
    output = shell_output("#{bin}/notescli create --dry-run --text '# Hi' --json")
    assert_match "\"dryRun\": true", output
  end

  def caveats
    <<~EOS
      On first run, macOS may prompt you to allow automation control:
        System Settings → Privacy & Security → Automation → allow your terminal to control “Notes”.
    EOS
  end
end
