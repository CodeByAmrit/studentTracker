document.getElementById('getExcelFile').addEventListener('click', async () => {
    document.getElementById("getExcelFile").innerHTML = `<span class="spinner-border spinner-border-sm" role="status"
                            aria-hidden="true"></span>`;
    try {
        const response = await fetch('/get-excel-student');
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'students.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert('Failed to download file');
        }

    } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error downloading file');
    } finally {
        document.getElementById("getExcelFile").innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="30px" height="30px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title>file_type_excel2</title><path d="M28.781,4.405H18.651V2.018L2,4.588V27.115l16.651,2.868V26.445H28.781A1.162,1.162,0,0,0,30,25.349V5.5A1.162,1.162,0,0,0,28.781,4.405Zm.16,21.126H18.617L18.6,23.642h2.487v-2.2H18.581l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2H28.941Z" style="fill:#20744a;fill-rule:evenodd"/><rect x="22.487" y="7.439" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="10.94" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="14.441" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="17.942" width="4.323" height="2.2" style="fill:#20744a"/><rect x="22.487" y="21.443" width="4.323" height="2.2" style="fill:#20744a"/><polygon points="6.347 10.673 8.493 10.55 9.842 14.259 11.436 10.397 13.582 10.274 10.976 15.54 13.582 20.819 11.313 20.666 9.781 16.642 8.248 20.513 6.163 20.329 8.585 15.666 6.347 10.673" style="fill:#ffffff;fill-rule:evenodd"/></svg>`;
    }

});