import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logo from "../assets/logo.png";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../services/Auth";
import FloatingActionButtonExtendedSize from "../components/FloatingLogoutButton";
import CurrentPosition from "../components/CurrentLocation";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Mappy = () => {
  const [map, setMap] = useState(null);
  const [mapEvent, setMapEvent] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [markers, setMarkers] = useState({}); // Add this state to track markers
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const distanceInputRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if (mapRef.current ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = [latitude, longitude];
          setCurrentPosition(coords);

          if (mapRef.current) {
            const newMap = L.map(mapRef.current).setView(coords, 13);

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(newMap);

            L.marker(coords)
              .addTo(newMap)
              .bindPopup("You are here!")
              .openPopup();

            newMap.on("click", (e) => {
              setMapEvent(e);
              formRef.current.classList.remove("hidden");
              distanceInputRef.current.focus();
            });

            setMap(newMap);
          }
        },
        (err) => 
         console.log(JSON.stringify(err))
      );
    }
  }, [mapRef.current]);


  

  const focusOnCurrentPosition = () => {
    if (map && currentPosition) {
      map.setView(currentPosition, 13);
      L.marker(currentPosition)
        .addTo(map)
        .bindPopup("You are here!")
        .openPopup();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const type = formData.get("type");
    const distance = parseFloat(formData.get("distance"));
    const duration = parseFloat(formData.get("duration"));
    const cadence = parseFloat(formData.get("cadence"));
    const elevation = parseFloat(formData.get("elevation"));

    if (
      isNaN(distance) ||
      isNaN(duration) ||
      (type === "running" && isNaN(cadence)) ||
      (type === "cycling" && isNaN(elevation))
    ) {
      alert("Inputs have to be positive!");
      return;
    }

    const { lat, lng } = mapEvent.latlng;
    let workout;

    if (type === "running") {
      workout = {
        type: "running",
        coords: [lat, lng],
        distance,
        duration,
        cadence,
        pace: duration / distance,
        description: `Running on ${
          months[new Date().getMonth()]
        } ${new Date().getDate()}`,
      };
    }

    if (type === "cycling") {
      workout = {
        type: "cycling",
        coords: [lat, lng],
        distance,
        duration,
        elevationGain: elevation,
        speed: distance / duration,
        description: `Cycling on ${
          months[new Date().getMonth()]
        } ${new Date().getDate()}`,
      };
    }

    setWorkouts((prevWorkouts) => {
      const updatedWorkouts = [...prevWorkouts, workout];
      localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
      return updatedWorkouts;
    });

    if (map) {
      // Create marker and add to map
      const marker = L.marker(workout.coords)
        .addTo(map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`,
          })
        )
        .setPopupContent(
          `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
        )
        .openPopup();

      // Store marker reference
      setMarkers((prevMarkers) => ({
        ...prevMarkers,
        [workout.description]: marker,
      }));
    }

    formRef.current.classList.add("hidden");
    e.target.reset();
  };

  useEffect(() => {
    if (map) {
      const storedWorkouts = JSON.parse(localStorage.getItem("workouts"));
      if (storedWorkouts) {
        setWorkouts(storedWorkouts);
        const newMarkers = {};
        storedWorkouts.forEach((workout) => {
          const marker = L.marker(workout.coords)
            .addTo(map)
            .bindPopup(
              L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
              })
            )
            .setPopupContent(
              `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${
                workout.description
              }`
            )
            .openPopup();

          newMarkers[workout.description] = marker;
        });
        setMarkers(newMarkers);
      }
    }
  }, [map]);

  const focusOnMarker = (description) => {
    const marker = markers[description];
    if (map && marker) {
      map.setView(marker.getLatLng(), 13);
      marker.openPopup();
    }
  };

  const navigate = useNavigate();

  const logoutUser = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="flex h-screen ">
        <div className="w-1/3 bg-gray-800 p-8 text-white">
          <img src={logo} alt="Logo" className="h-20 mx-auto mb-8" />
          <ul className="list-none h-3/4 overflow-y-scroll flex flex-col space-y-7">
            <form
              ref={formRef}
              className="bg-gray-700 p-6 rounded-lg hidden"
              onSubmit={handleFormSubmit}
            >
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Type</label>
                <select
                  name="type"
                  className="w-full p-2 bg-gray-600 rounded"
                  required
                >
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Distance
                </label>
                <input
                  name="distance"
                  type="number"
                  placeholder="km"
                  className="form__input--distance w-full p-2 bg-gray-600 rounded"
                  ref={distanceInputRef}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Duration
                </label>
                <input
                  name="duration"
                  type="number"
                  placeholder="min"
                  className="w-full p-2 bg-gray-600 rounded"
                  required
                />
              </div>
              {mapEvent && mapEvent.latlng && (
                <>
                  {formRef.current &&
                    formRef.current.elements.type.value === "running" && (
                      <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">
                          Cadence
                        </label>
                        <input
                          name="cadence"
                          type="number"
                          placeholder="steps/min"
                          className="w-full p-2 bg-gray-600 rounded"
                          required
                        />
                      </div>
                    )}
                  {formRef.current &&
                    formRef.current.elements.type.value === "cycling" && (
                      <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">
                          Elevation Gain
                        </label>
                        <input
                          name="elevation"
                          type="number"
                          placeholder="meters"
                          className="w-full p-2 bg-gray-600 rounded"
                          required
                        />
                      </div>
                    )}
                </>
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                OK
              </button>
            </form>
            <ul>
              {workouts.map((workout) => (
                <li
                  key={workout.description}
                  className={`flex text-wrap gap-2 justify-center items-center  bg-gray-700 p-4 mb-4 rounded-lg cursor-pointer ${
                    workout.type === "running"
                      ? "border-l-4 border-blue-500"
                      : "border-l-4 border-yellow-500"
                  }`}
                  onClick={() => focusOnMarker(workout.description)}
                >
                  <h2 className="text-sm font-semibold mb-2">
                    {workout.description}
                  </h2>
                  <div className="flex items-baseline mb-2">
                    <span className="text-sm mr-2">
                      {workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}
                    </span>
                    <span className="text-sm">{workout.distance} km</span>
                  </div>
                  <div className="flex items-baseline mb-2">
                    <span className="text-sm mr-2">⏱</span>
                    <span className="text-sm">{workout.duration} min</span>
                  </div>
                  {workout.type === "running" && (
                    <>
                      <div className="flex items-baseline mb-2">
                        <span className="text-sm mr-2">⚡️</span>
                        <span className="text-sm">
                          {workout.pace ? workout.pace.toFixed(1) : "N/A"}{" "}
                          min/km
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-sm mr-2">🦶🏼</span>
                        <span className="text-sm">
                          {workout.cadence ? workout.cadence : "N/A"} spm
                        </span>
                      </div>
                    </>
                  )}
                  {workout.type === "cycling" && (
                    <>
                      <div className="flex items-baseline mb-2">
                        <span className="text-sm mr-2">⚡️</span>
                        <span className="text-sm">
                          {workout.speed ? workout.speed.toFixed(1) : "N/A"}{" "}
                          km/h
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-sm mr-2">⛰️</span>
                        <span className="text-sm">
                          {workout.elevationGain
                            ? workout.elevationGain
                            : "N/A"}{" "}
                          m
                        </span>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </ul>
        </div>
        <div ref={mapRef} className="w-3/4 h-full relative">
          <FloatingActionButtonExtendedSize logoutUser={logoutUser} />
          <CurrentPosition focusOnCurrentPosition={focusOnCurrentPosition} />
        </div>
      </div>
    </>
  );
};

export default Mappy;
