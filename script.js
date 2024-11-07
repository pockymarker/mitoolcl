// 게시글 데이터를 로컬 스토리지에 저장
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let currentCategory = 'all';

// DOM 요소
const postsSection = document.getElementById('posts');
const writeForm = document.getElementById('write-form');
const blogForm = document.getElementById('blog-form');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');

// 이미지 미리보기
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="미리보기">`;
        }
        reader.readAsDataURL(file);
    }
});

// 카테고리 필터링
document.getElementById('category-filter').addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.tagName === 'A') {
        currentCategory = e.target.dataset.category;
        // 활성 카테고리 스타일 변경
        document.querySelectorAll('#category-filter a').forEach(a => {
            a.classList.remove('active');
        });
        e.target.classList.add('active');
        displayPosts();
    }
});

// 글 작성 처리
blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const category = document.getElementById('category').value;
    const date = new Date().toLocaleDateString();
    let imageUrl = '';

    // 이미지 처리
    const imageFile = imageInput.files[0];
    if (imageFile) {
        imageUrl = await convertImageToBase64(imageFile);
    }

    const newPost = {
        title,
        content,
        category,
        date,
        imageUrl
    };

    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    displayPosts();
    blogForm.reset();
    imagePreview.innerHTML = '';
    
    // 홈으로 이동
    writeForm.classList.add('hidden');
    postsSection.classList.remove('hidden');
});

// 게시글 표시 함수
function displayPosts() {
    postsSection.innerHTML = posts.map(post => `
        <article class="post">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <small>${post.date}</small>
        </article>
    `).join('');
}

// 초기 게시글 표시
displayPosts(); 

// 이미지를 Base64로 변환
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function(e) {
            reject(e);
        };
        reader.readAsDataURL(file);
    });
} 

// 네비게이션 처리 수정
document.querySelector('nav').addEventListener('click', (e) => {
    e.preventDefault();
    
    // 클릭된 요소가 링크인 경우
    const link = e.target.closest('a');
    if (!link) return;
    
    const section = link.getAttribute('href').substring(1);
    
    if (section === 'home') {
        writeForm.classList.add('hidden');
        postsSection.classList.remove('hidden');
    } else if (section === 'write') {
        writeForm.classList.remove('hidden');
        postsSection.classList.add('hidden');
    }
}); 