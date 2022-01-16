import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radio.Field";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useSelector, useDispatch } from "react-redux";
import { getQualities, getQualitiesLoadingStatus } from "../../../store/qualities";
import { getProfessionLoadingStatus, getProfessions } from "../../../store/professions";
import { getCurrentUser, update } from "../../../store/users";

const EditUserPage = () => {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const currentUser = useSelector(getCurrentUser());
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(currentUser);

    const qualities = useSelector(getQualities());
    const isLoadQual = useSelector(getQualitiesLoadingStatus());
    const professions = useSelector(getProfessions());
    const isLoadProf = useSelector(getProfessionLoadingStatus());

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        const { qualities: quals, ...userData } = data;
        const userQualities = quals.map(({ value }) => value);

        dispatch(update({ ...userData, qualities: userQualities }));
        history.push(`/users/${data._id}`);
    };
    const transformData = (data) => {
        return data.map((qual) => ({ label: qual.name, value: qual._id }));
    };

    useEffect(() => {
        if (currentUser._id === userId) return;
        history.push(`/users/${currentUser._id}/edit`);
    }, []);

    useEffect(() => {
        setIsLoading(false);
    }, [isLoadProf, isLoadQual]);

    const validatorConfig = {
        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        },
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        }
    };
    useEffect(() => validate(), [data]);
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;
    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {isLoading ? "Loading..." : (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                name="profession"
                                options={transformData(professions)}
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={data.qualities.map((id) => transformData(qualities).find(({ value }) => value === id))}
                                options={transformData(qualities)}
                                onChange={handleChange}
                                values
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
