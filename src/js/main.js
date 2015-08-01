// jQuery
//---
$('.navitem').on('click', function (e) {
	e.preventDefault();
});

var mediaelement = function () {
	$('video').mediaelementplayer({
		enableAutosize: true,
		alwaysShowControls: false,
		iPadUseNativeControls: false,
		iPhoneUseNativeControls: false,
		AndroidUseNativeControls: false,
		alwaysShowHours: false,
		showTimecodeFrameCount: false,
		features: ['playpause', 'progress', 'current', 'duration', 'tracks', 'volume', 'fullscreen']
	});
};


// React JS
//---

var VideoWrapper = React.createClass({
	render: function () {
		return (
			<video className="responsive-video" controls>
				<source src={this.props.path} type="video/mp4" />
      </video>
		);
	}
});

var ChapterList = React.createClass({
	handleClick: function () {

	},
	render: function () {
		var chapterData = data.chapters;
		var chapterNodes = chapterData.map(function (chapter) {
			return (
				<Chapter id={chapter.id} key={chapter.id} name={chapter.name} file={chapter.file}></Chapter>
			);
		});

		React.render(<VideoWrapper path={"media/" + chapterNodes[0].props.file} />, $('footer').get(0));
		mediaelement();

		return (
			<ul className="chapters-list">
				{chapterNodes}
			</ul>
		);
	}
});

var Chapter = React.createClass({
	handleClick: function () {
		React.render(<VideoWrapper path={"media/" + this.props.file} />, $('footer').get(0));
		return mediaelement();
	},
	render: function () {
		return ( 
			<li id={this.props.id} className="chapter">
				<a href="#" className="navitem" data-video={this.props.file} onClick={this.handleClick}>
					{this.props.name}
				</a>
			</li>
		);
	}
});

React.render(<ChapterList/>, $('main').get(0));