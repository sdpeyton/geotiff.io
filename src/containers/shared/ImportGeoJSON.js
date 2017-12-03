import ImportGeoJSONComponent from '../../components/shared/ImportGeoJSONComponent';
import { add_geometry } from '../../actions/geometry-actions';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';

const add_geojson = geojson => {
    let geometry = JSON.parse(geojson);
    return add_geometry(geometry, 'geojson');
}

const is_json_str = json => {
    try {
        JSON.parse(json);
    } catch(e) {
        return false;
    }
    return true;
}

const import_geojson = event => {
    return new Promise((resolve, reject) => {
        let file = event.target.files[0];
        let file_reader = new FileReader();
        file_reader.onload = evt => {
            try {
                let geojson = evt.target.result;
                if (is_json_str(geojson)) {
                    resolve(geojson);
                } else {
                    throw 'File could not be uploaded. Please make sure to upload a valid JSON file';
                }
            } catch(e) {
                alert(e);
            }
        }
        file_reader.readAsText(file);
    });
}     

const mapDispatchToProps = dispatch => {
    return {
        add_geojson: geojson => dispatch(add_geojson(geojson))
    }
}

const ImportGeoJSON = compose(
    connect(null, mapDispatchToProps),
    withState('geojson', 'update_geojson', ''),
    withHandlers({
        on_change: ({ update_geojson }) => event => {
            update_geojson(event.target.value)
        },
        import_geojson: ({ update_geojson }) => event => {
            import_geojson(event).then(update_geojson);
        }
    })
)(ImportGeoJSONComponent);

export default ImportGeoJSON;