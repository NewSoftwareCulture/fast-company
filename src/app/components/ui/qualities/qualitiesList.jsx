import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Quality from "./quality";
import { getQualitiesByIds, getQualitiesLoadingStatus, loadQualities } from "../../../store/qualities";
import { useSelector, useDispatch } from "react-redux";

const QualitiesList = ({ qualities: qualitiesIds }) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(getQualitiesLoadingStatus());
    const qualities = useSelector(getQualitiesByIds(qualitiesIds));

    useEffect(() => {
        dispatch(loadQualities());
    }, []);

    if (isLoading) return "Loadind ...";

    return (
        <>
            {qualities.map((qual) => (
                <Quality key={qual._id} {...qual} />
            ))}
        </>
    );
};

QualitiesList.propTypes = {
    qualities: PropTypes.array
};

export default QualitiesList;
