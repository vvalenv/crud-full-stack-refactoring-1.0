/*
*    File        : frontend/js/controllers/subjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 2.0 ( prototype )
*/

import { subjectsAPI } from '../api/subjectsAPI.js';

//2.0
//For pagination:
let currentPage = 1;
let totalPages = 1;
const limit = 5;

document.addEventListener('DOMContentLoaded', () => 
{
    loadSubjects();
    setupFormHandler();
    setupCancelHandler();
    setupPaginationControls(); //2.0
});
  
function setupFormHandler()
{
    const form = document.getElementById('subjectForm');
    form.addEventListener('submit', async e => 
    {
        e.preventDefault();
        const subject = getFormData();
    
        try 
        {
            if (subject.id) 
            {
                await subjectsAPI.update(subject);
            } 
            else 
            {
                await subjectsAPI.create(subject);
            }
            clearForm();
            loadSubjects();
        }
        catch (err)
        {
            console.error(err.message);
        }
    });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = '';
    });
}

//2.0
function setupPaginationControls() 
{
    document.getElementById('prevPage').addEventListener('click', () => 
    {
        if (currentPage > 1) 
        {
            currentPage--;
            loadSubjects();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => 
    {
        if (currentPage < totalPages) 
        {
            currentPage++;
            loadSubjects();
        }
    });

    document.getElementById('resultsPerPage').addEventListener('change', e => 
    {
        currentPage = 1;
        loadSubjects();
    });
}
  
function getFormData()
{
    return {
        id: document.getElementById('subjectId').value.trim(),
        name: document.getElementById('name').value.trim(),
      //  email: document.getElementById('email').value.trim(),
       // age: parseInt(document.getElementById('age').value.trim(), 10)
    };
}
  
function clearForm()
{
    document.getElementById('subjectForm').reset();
    document.getElementById('subjectId').value = '';
}

//2.0
async function loadSubjects()
{
    try 
    {
        const resPerPage = parseInt(document.getElementById('resultsPerPage').value, 10) || limit;
        const data = await subjectsAPI.fetchPaginated(currentPage, resPerPage);
        console.log(data);
        renderSubjectTable(data.subjects);
        totalPages = Math.ceil(data.total / resPerPage);
        document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    } 
    catch (err) 
    {
        console.error('Error cargando materias:', err.message);
    }
}
  
function renderSubjectTable(subjects)
{
    const tbody = document.getElementById('subjectTableBody');
    tbody.replaceChildren();
  
    subjects.forEach(subject => 
    {
        const tr = document.createElement('tr');
    
        tr.appendChild(createCell(subject.name));
        //tr.appendChild(createCell(student.email));
        //tr.appendChild(createCell(student.age.toString()));
        tr.appendChild(createActionsCell(subject));
    
        tbody.appendChild(tr);
    });
}
  
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}
  
function createActionsCell(subject)
{
    const td = document.createElement('td');
  
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(subject));
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(subject.id));
  
    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}
  
function fillForm(subject)
{
    document.getElementById('subjectId').value = subject.id;
    document.getElementById('name').value = subject.name;
   // document.getElementById('email').value = student.email;
  //  document.getElementById('age').value = student.age;
}
  
async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;
  
    try 
    {
        await subjectsAPI.remove(id);
        loadSubjects();
    } 
    catch (err) 
    {
        console.error('Error al borrar:', err.message);
    }
}
  