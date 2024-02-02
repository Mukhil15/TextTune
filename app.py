
from flask import Flask, render_template, request, send_file, jsonify
from googletrans import Translator
from moviepy.editor import VideoFileClip
import speech_recognition as sr
from pydub import AudioSegment

app = Flask(__name__)

# Functions for video-to-audio conversion and transcription


def extract_audio_from_video(video_path):
    video = VideoFileClip(video_path)
    audio = video.audio
    audio_path = "temp_audio.wav"
    audio.write_audiofile(audio_path)
    return audio_path


def transcribe_audio_to_text(audio_path, language='ta-IN'):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio, language=language)
        return text
    except sr.UnknownValueError:
        return "Transcription could not be understood"
    except sr.RequestError as e:
        return f"Could not request results from Google Web Speech API; {e}"

# Routes from the first app.py file


@app.route('/translate')
def translate():
    return render_template('translate.html')


@app.route('/translate', methods=['POST'])
def convert():
    if 'file' not in request.files:
        return "No file part"

    language = request.form.get('language')
    files = request.files.getlist('file')

    recognizer = sr.Recognizer()
    translator = Translator()
    results = []

    all_transcriptions = ""

    for file in files:
        if file.filename == '':
            results.append(
                {"language": language, "transcription": "No selected file", "translation": "No selected file"})
            continue

        try:
            audio = AudioSegment.from_file(file)
            wav_file = file.filename.replace('.mp3', '.wav').replace(
                '.flac', '.wav').replace('.m4a', '.wav')
            audio.export(wav_file, format='wav')

            with sr.AudioFile(wav_file) as source:
                audio_data = recognizer.record(source)
                transcription = recognizer.recognize_google(
                    audio_data, language='ta-IN')

                all_transcriptions += transcription + " "

        except sr.UnknownValueError:
            results.append({"language": language, "transcription": "Could not understand audio",
                           "translation": "Could not understand audio"})
        except sr.RequestError as e:
            results.append({"language": language, "transcription": f"Could not request results; {e}",
                           "translation": f"Could not request results; {e}"})
        finally:
            if wav_file:
                import os
                os.remove(wav_file)

    try:
        translation = translator.translate(
            all_transcriptions, src='ta', dest=language).text
        results.append(
            {"language": language, "transcription": all_transcriptions, "translation": translation})
    except Exception as e:
        results.append({"language": language, "transcription": all_transcriptions,
                       "translation": f"Translation error: {e}"})

    return jsonify(results)

# Routes from the second app.py file


@app.route('/')
def login_page():
    return render_template('Login.html')


@app.route('/regist.html')
def register_page():
    return render_template('regist.html')


@app.route('/test')
def test_template_route():
    return render_template('test.html')


@app.route('/convert', methods=['GET', 'POST'])
def convert_audio():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No file part"

        files = request.files.getlist('file')

        recognizer = sr.Recognizer()
        results = []

        for file in files:
            if file.filename == '':
                results.append("No selected file")
                continue

            try:
                audio = AudioSegment.from_file(file)
                wav_file = file.filename.replace('.mp3', '.wav').replace(
                    '.flac', '.wav').replace('.m4a', '.wav')
                audio.export(wav_file, format='wav')

                with sr.AudioFile(wav_file) as source:
                    audio_data = recognizer.record(source)
                    audio_text = recognizer.recognize_google(
                        audio_data, language='ta-IN')

                results.append(audio_text)
            except sr.UnknownValueError:
                results.append("Could not understand audio")
            except sr.RequestError as e:
                results.append(
                    f"Could not request results from Google Speech Recognition service; {e}")
            finally:
                if wav_file:
                    import os
                    os.remove(wav_file)

        return "<br>".join(results)
    return render_template('index.html')


@app.route('/videot', methods=['GET', 'POST'])
def convert_video():
    transcript = None

    try:
        if request.method == 'POST':
            video = request.files['video']
            video_path = "temp_video.mp4"
            video.save(video_path)

            audio_path = extract_audio_from_video(video_path)
            transcript = transcribe_audio_to_text(audio_path, language='ta-IN')
    except:
        transcript = "No selected file"

    return render_template('videot.html', transcript=transcript)


@app.route('/download_audio')
def download_audio():
    audio_path = "temp_audio.wav"
    return send_file(audio_path, as_attachment=True, download_name="converted_audio.wav")


if __name__ == '__main__':
    app.run(debug=True)
