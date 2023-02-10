const fileInput = document.querySelector('.file-input');
const choseImgBtn = document.querySelector('.chose-img');
const prevIMG = document.querySelector('.preview-img img');
const filterOptions = document.querySelectorAll('.filter button');
const filterName = document.querySelector('.filter-info .name');
const filterSlider = document.querySelector('.slider input');
const filterValue = document.querySelector('.slider .value');
const rotateOption = document.querySelectorAll('.rotate button');
const btnRestore = document.querySelector('.reset-filter');
const saveImgBtn = document.querySelector('.save-img');

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {

    prevIMG.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;
    prevIMG.style.filter = `brightness(${brightness}%) saturate(${saturation / 100}) invert(${inversion}%) grayscale(${grayscale}%)`;
}
const loadImage = () => {
    let file = fileInput.files[0]; //getting user selected file;
    if (!file) return; //return if user not selected file
    prevIMG.src = URL.createObjectURL(file); // passing file url as previwe img src
    prevIMG.addEventListener("load", () => {
        resetFilter();
        document.querySelector('.container').classList.remove('disable');
    })
}

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        document.querySelector('.filter .active').classList.remove('active');
        option.classList.add('active');
        filterName.innerHTML = option.innerText;
        if (option.id === 'brightness') {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === 'saturation') {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === 'inversion') {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }

    })
})

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector('.filter .active'); //getting selected filter btn

    if (selectedFilter.id === 'brightness') {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === 'saturation') {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === 'inversion') {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilters();
}
rotateOption.forEach(option => {
    option.addEventListener('click', () => {
        if (option.id === 'left') {
            rotate -= 90;
        }
        else if (option.id === 'right') {
            rotate += 90;
        }
        else if (option.id === 'vartical') {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        else {
            flipVertical = flipVertical === 1 ? -1 : 1;

        }
        applyFilters();
    });

})

const resetFilter = () => {
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilters();
}
const saveImage = () => {
    const canvas = document.createElement('canvas'); //creatinmg canvas element
    const ctx = canvas.getContext('2d'); //canvas.getContext return a drawinf context on the canvas
    canvas.width = prevIMG.naturalWidth;
    canvas.height = prevIMG.naturalHeight;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.scale(flipVertical, flipHorizontal);
    ctx.drawImage(prevIMG, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = 'image.jpg';
    link.href = canvas.toDataURL();
    link.click();


}

fileInput.addEventListener("change", loadImage);
btnRestore.addEventListener('click', resetFilter);
filterSlider.addEventListener('input', updateFilter)
saveImgBtn.addEventListener('click', saveImage);
choseImgBtn.addEventListener('click', () => fileInput.click());
