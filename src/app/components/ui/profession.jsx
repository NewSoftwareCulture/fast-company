import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getProfession, getProfessionLoadingStatus, loadProfessions } from "../../store/professions";

const Profession = ({ id }) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(getProfessionLoadingStatus(id));
    const prof = useSelector(getProfession(id));

    useEffect(() => {
        dispatch(loadProfessions());
    }, []);

    if (isLoading) return "loading ...";

    return <p>{prof.name}</p>;
};
Profession.propTypes = {
    id: PropTypes.string
};
export default Profession;
