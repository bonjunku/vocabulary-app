import SwiftUI
import AVKit

struct Example: Identifiable {
    let id = UUID()
    let sentence: String
    let videoURL: URL
    let player: AVPlayer
}

struct Word: Identifiable {
    let id = UUID()
    let text: String
    let examples: [Example]
}

struct ContentView: View {
    @State private var words: [Word] = SampleData.words
    @State private var currentWordIndex = 0
    @State private var currentExampleIndex = 0
    @State private var dragOffset: CGSize = .zero
    @State private var playerPaused = false
    @Namespace private var animationNamespace

    var body: some View {
        GeometryReader { geo in
            let currentExample = words[currentWordIndex].examples[currentExampleIndex]
            let hasNext = currentExampleIndex < words[currentWordIndex].examples.count - 1
            let hasPrev = currentExampleIndex > 0

            ZStack {
                if hasNext {
                    let nextExample = words[currentWordIndex].examples[currentExampleIndex + 1]
                    VideoPlayerLayer(player: nextExample.player)
                        .frame(width: geo.size.width, height: geo.size.height)
                        .offset(y: geo.size.height + dragOffset.height)
                        .clipped()
                }

                if hasPrev {
                    let prevExample = words[currentWordIndex].examples[currentExampleIndex - 1]
                    VideoPlayerLayer(player: prevExample.player)
                        .frame(width: geo.size.width, height: geo.size.height)
                        .offset(y: -geo.size.height + dragOffset.height)
                        .clipped()
                }

                VideoPlayerLayer(player: currentExample.player)
                    .frame(width: geo.size.width, height: geo.size.height)
                    .offset(y: dragOffset.height)
                    .clipped()
                    .matchedGeometryEffect(id: "video", in: animationNamespace)

                VStack {
                    Text(currentExample.sentence)
                        .font(.title.bold())
                        .padding()
                        .background(Color.white.opacity(0.8))
                        .cornerRadius(12)
                        .offset(y: dragOffset.height)
                        .padding(.top, 60)

                    Spacer()

                    HStack(spacing: 12) {
                        FeedbackButton(title: "Again", color: .gray) { nextWord() }
                        FeedbackButton(title: "Hard", color: .gray) { nextWord() }
                        FeedbackButton(title: "Good", color: .gray) { nextWord() }
                        FeedbackButton(title: "Easy", color: .gray) { nextWord() }
                    }
                    .padding(.bottom, 40)
                    .offset(y: dragOffset.height)
                }
            }
            .onAppear {
                playCurrentVideo()
            }
            .gesture(
                DragGesture()
                    .onChanged { value in
                        dragOffset = value.translation
                    }
                    .onEnded { value in
                        handleSwipe(value: value, geo: geo)
                    }
            )
            .simultaneousGesture(
                TapGesture().onEnded {
                    playerPaused.toggle()
                    if playerPaused {
                        currentExample.player.pause()
                    } else {
                        currentExample.player.play()
                    }
                }
            )
        }
        .edgesIgnoringSafeArea(.all)
    }

    func handleSwipe(value: DragGesture.Value, geo: GeometryProxy) {
        let translation = value.translation
        withAnimation(.easeInOut(duration: 0.25)) {
            if abs(translation.height) > abs(translation.width) {
                if translation.height < -100 {
                    dragOffset = CGSize(width: 0, height: -geo.size.height)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                        nextExample()
                        dragOffset = .zero
                    }
                } else if translation.height > 100 {
                    dragOffset = CGSize(width: 0, height: geo.size.height)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                        previousExample()
                        dragOffset = .zero
                    }
                }
            } else {
                if translation.width < -100 {
                    dragOffset = CGSize(width: -geo.size.width, height: 0)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                        nextWord()
                        dragOffset = .zero
                    }
                } else if translation.width > 100 {
                    dragOffset = CGSize(width: geo.size.width, height: 0)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                        previousWord()
                        dragOffset = .zero
                    }
                } else {
                    dragOffset = .zero
                }
            }
        }
    }

    func playCurrentVideo() {
        let player = words[currentWordIndex].examples[currentExampleIndex].player
        player.seek(to: .zero)
        player.play()
    }

    func nextExample() {
        if currentExampleIndex < words[currentWordIndex].examples.count - 1 {
            currentExampleIndex += 1
            playCurrentVideo()
        }
    }

    func previousExample() {
        if currentExampleIndex > 0 {
            currentExampleIndex -= 1
            playCurrentVideo()
        }
    }

    func nextWord() {
        if currentWordIndex < words.count - 1 {
            currentWordIndex += 1
            currentExampleIndex = 0
            playCurrentVideo()
        }
    }

    func previousWord() {
        if currentWordIndex > 0 {
            currentWordIndex -= 1
            currentExampleIndex = 0
            playCurrentVideo()
        }
    }
}

struct VideoPlayerLayer: UIViewControllerRepresentable {
    let player: AVPlayer

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let controller = AVPlayerViewController()
        controller.player = player
        controller.showsPlaybackControls = false
        return controller
    }

    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {
        uiViewController.player = player
    }
}

struct FeedbackButton: View {
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .padding()
                .frame(minWidth: 70)
                .background(color.opacity(0.2))
                .cornerRadius(8)
        }
    }
}

struct SampleData {
    static let words: [Word] = [
        Word(text: "apple", examples: [
            Example(sentence: "She eats an apple every day", videoURL: URL(string: "https://www.w3schools.com/html/mov_bbb.mp4")!, player: AVPlayer(url: URL(string: "https://www.w3schools.com/html/mov_bbb.mp4")!)),
            Example(sentence: "He bought an apple from the store", videoURL: URL(string: "https://www.w3schools.com/html/movie.mp4")!, player: AVPlayer(url: URL(string: "https://www.w3schools.com/html/movie.mp4")!))
        ]),
        Word(text: "banana", examples: [
            Example(sentence: "Bananas are great in smoothies", videoURL: URL(string: "https://www.w3schools.com/html/movIe.mp4")!, player: AVPlayer(url: URL(string: "https://www.w3schools.com/html/movie.mp4")!)),
            Example(sentence: "He peeled a banana", videoURL: URL(string: "https://www.w3schools.com/html/mov_bbb.mp4")!, player: AVPlayer(url: URL(string: "https://www.w3schools.com/html/mov_bbb.mp4")!))
        ])
    ]
}

#Preview {
    ContentView()
}

