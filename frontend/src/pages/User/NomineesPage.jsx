import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import nomineeService from '../../api/nomineeService';

const NomineesPage = () => {
  const [nominees, setNominees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('');

  const fetchNominees = async () => {
    try {
      setIsLoading(true);
      const data = await nomineeService.getNominees();
      setNominees(data);
    } catch (err) {
      setError('Could not load nominee data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNominees();
  }, []);

  const handleAddNominee = async (e) => {
    e.preventDefault();
    if (nominees.length >= 2) {
      setError('You can add a maximum of 2 nominees.');
      return;
    }
    try {
      await nomineeService.addNominee({ 
        nominee_name: newName, 
        user_relationship: newRelationship 
      });
      setNewName('');
      setNewRelationship('');
      fetchNominees();
    } catch (err) {
      setError('Failed to add nominee.');
    }
  };
  
  const handleDeleteNominee = async (nomineeId) => {
    try {
      await nomineeService.deleteNominee(nomineeId);
      fetchNominees();
    } catch (err) {
      setError('Failed to delete nominee.');
    }
  };

  return (
    <div>
      <h1 className="page-header">Manage Your Nominees</h1>
      
      <div className="table-container" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Add a New Nominee</h2>
        <form onSubmit={handleAddNominee} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group">
            <Input 
              name="newName" 
              placeholder="Nominee Full Name" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <Input 
              name="newRelationship" 
              placeholder="Relationship (e.g., Spouse, Son)" 
              value={newRelationship} 
              onChange={(e) => setNewRelationship(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit">Add Nominee</Button>
        </form>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      <div className="nominee-list">
        {isLoading ? (
          <p>Loading nominees...</p>
        ) : (
          nominees.map((nominee) => (
            <div key={nominee.id} className="nominee-item">
              <div>
                <p>{nominee.nominee_name}</p>
                <p style={{ color: '#6b7280' }}>{nominee.user_relationship}</p>
              </div>
              <Button onClick={() => handleDeleteNominee(nominee.id)} variant="secondary">
                Delete
              </Button>
            </div>
          ))
        )}
        {nominees.length === 0 && !isLoading && <p style={{ textAlign: 'center', color: '#6b7280' }}>You have not added any nominees yet.</p>}
      </div>
    </div>
  );
};

export default NomineesPage;