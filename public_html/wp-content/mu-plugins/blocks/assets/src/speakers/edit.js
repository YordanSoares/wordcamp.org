/**
 * External dependencies
 */
import { orderBy, intersection, split } from 'lodash';

/**
 * WordPress dependencies
 */
const { withSelect } = wp.data;
const { Component, Fragment } = wp.element;
const { dispatch } = wp.data;

/**
 * Internal dependencies
 */
import SpeakersBlockControls from './block-controls';
import SpeakersInspectorControls from './inspector-controls';
import SpeakersToolbar from './toolbar';
import { ICON }        from './index';
import { WC_BLOCKS_STORE } from '../blocks-store';

const blockData = window.WordCampBlocks.speakers || {};

class SpeakersEdit extends Component {

	render() {
		const { mode } = this.props.attributes;

		return (
			<Fragment>
				<SpeakersBlockControls
					icon={ ICON }
					{ ...this.props }
					{ ...this.state }
				/>
				{ mode &&
					<Fragment>
						<SpeakersInspectorControls { ...this.props } />
						<SpeakersToolbar { ...this.props } />
					</Fragment>
				}
			</Fragment>
		);
	}
}

const speakersSelect = ( select, props ) => {
	const { mode, item_ids, sort } = props.attributes;
	const [ orderby, order ] = split( sort, '_', 2 );

	const args = {};

	args.orderBy = ( results ) => {
		return orderBy( results, [ 'title' === orderby ? 'title.rendered' : orderby ], [ order ] );
	};

	if ( Array.isArray( item_ids ) ) {
		switch ( mode ) {
			case 'wcb_speaker':
				args.entityIds = item_ids;
				break;
			case 'wcb_speaker_group':
				args.filterEntities = ( item ) => intersection( item.speaker_group, item_ids ).length > 0;
				break;
		}
	}

	const { getEntities } = select( WC_BLOCKS_STORE );

	return {
		blockData       : blockData,
		speakerPosts    : getEntities( 'speakers', args ),
		tracks          : getEntities( 'session_track' ),
		allSpeakerPosts : getEntities( 'speakers' ),
		allSpeakerTerms : getEntities( 'speaker_group' ),
	};
};

export const edit = withSelect( speakersSelect )( SpeakersEdit );
