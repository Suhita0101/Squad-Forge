import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

// We'll use local storage instead of Supabase to ensure it works reliably
const LOCAL_STORAGE_KEY = 'squad_forge_team_members';

// Initial team members data
const initialTeamMembers = [
  {
    id: 1,
    name: "Elara Sunblade",
    role: "Healer",
    strength: "Medium",
    speed: "Fast",
    special_ability: "Magic",
    created_at: "2025-04-10T10:30:00.000Z"
  },
  {
    id: 2,
    name: "Grimheart",
    role: "Tank",
    strength: "Maximum",
    speed: "Slow",
    special_ability: "Tech",
    created_at: "2025-04-12T14:15:00.000Z"
  },
  {
    id: 3,
    name: "Zephyr",
    role: "Scout",
    strength: "Medium",
    speed: "Lightning",
    special_ability: "Stealth",
    created_at: "2025-04-15T09:45:00.000Z"
  },
  {
    id: 4,
    name: "Ember",
    role: "Damage",
    strength: "High",
    speed: "Fast",
    special_ability: "Magic",
    created_at: "2025-04-17T11:20:00.000Z"
  }
];

// Data management functions
const getTeamMembers = () => {
  const storedMembers = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedMembers) {
    return JSON.parse(storedMembers);
  }
  // Initialize with default members if none exist
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialTeamMembers));
  return initialTeamMembers;
};

const saveTeamMembers = (members) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
};

function App() {
  const appTitle = "Squad Forge";
  
  return (
    <Router>
      <div className="App">
        <header>
          <h1>{appTitle}</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/team">View Team</Link>
            <Link to="/create">Create Member</Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/team" element={<SummaryPage />} />
            <Route path="/create" element={<CreateForm />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/edit/:id" element={<EditForm />} />
          </Routes>
        </main>
        
        <footer>
          <p>© 2025 Squad Forge - Build Your Ultimate Team</p>
        </footer>
      </div>
    </Router>
  );
}

// Home Page Component
function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h2>Welcome to Squad Forge</h2>
        <p>Create, manage, and optimize your perfect team of heroes</p>
        <div className="hero-actions">
          <Link to="/team" className="primary-btn">View Your Team</Link>
          <Link to="/create" className="secondary-btn">Add New Member</Link>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Create Heroes</h3>
          <p>Design unique team members with different roles and abilities</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚔️</div>
          <h3>Build Teams</h3>
          <p>Assemble powerful combinations of heroes with complementary skills</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">✨</div>
          <h3>Special Abilities</h3>
          <p>Unlock and utilize unique powers to enhance your team's capabilities</p>
        </div>
      </div>
    </div>
  );
}

// Create Form Component
function CreateForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState({
    role: 'Healer',
    strength: 'Medium',
    speed: 'Medium',
    specialAbility: 'None'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const roles = ['Healer', 'Tank', 'Damage', 'Support', 'Scout'];
  const strengthLevels = ['Low', 'Medium', 'High', 'Maximum'];
  const speedLevels = ['Slow', 'Medium', 'Fast', 'Lightning'];
  const specialAbilities = ['None', 'Stealth', 'Flight', 'Magic', 'Tech'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Get current members
      const currentMembers = getTeamMembers();
      
      // Generate a new ID (max ID + 1)
      const maxId = Math.max(...currentMembers.map(m => m.id), 0);
      const newId = maxId + 1;
      
      // Create new member
      const newMember = {
        id: newId,
        name,
        role: attributes.role,
        strength: attributes.strength,
        speed: attributes.speed,
        special_ability: attributes.specialAbility,
        created_at: new Date().toISOString()
      };
      
      // Add to members and save
      const updatedMembers = [...currentMembers, newMember];
      saveTeamMembers(updatedMembers);
      
      // Success - navigate to team page
      navigate('/team');
    } catch (err) {
      console.error('Error creating team member:', err);
      setError(`Failed to create team member: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeChange = (attribute, value) => {
    setAttributes(prev => ({ ...prev, [attribute]: value }));
  };

  return (
    <div className="create-form">
      <h2>Create New Team Member</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter hero name"
          />
        </div>
        
        <div className="form-group">
          <h3>Role:</h3>
          <div className="attribute-buttons">
            {roles.map(role => (
              <button
                key={role}
                type="button"
                className={attributes.role === role ? 'selected' : ''}
                onClick={() => handleAttributeChange('role', role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <h3>Strength:</h3>
          <div className="attribute-buttons">
            {strengthLevels.map(level => (
              <button
                key={level}
                type="button"
                className={attributes.strength === level ? 'selected' : ''}
                onClick={() => handleAttributeChange('strength', level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <h3>Speed:</h3>
          <div className="attribute-buttons">
            {speedLevels.map(level => (
              <button
                key={level}
                type="button"
                className={attributes.speed === level ? 'selected' : ''}
                onClick={() => handleAttributeChange('speed', level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <h3>Special Ability:</h3>
          <div className="attribute-buttons">
            {specialAbilities.map(ability => (
              <button
                key={ability}
                type="button"
                className={attributes.specialAbility === ability ? 'selected' : ''}
                onClick={() => handleAttributeChange('specialAbility', ability)}
              >
                {ability}
              </button>
            ))}
          </div>
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Team Member'}
        </button>
      </form>
    </div>
  );
}

// Summary Page Component
function SummaryPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get members from localStorage
    const loadedMembers = getTeamMembers();
    setMembers(loadedMembers);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading team members...</div>;
  }

  return (
    <div className="summary-page">
      <h2>Your Team</h2>
      {members.length === 0 ? (
        <p>No team members yet. <Link to="/create">Create one now!</Link></p>
      ) : (
        <div className="member-list">
          {members.map(member => (
            <div key={member.id} className="member-card">
              <h3><Link to={`/detail/${member.id}`}>{member.name}</Link></h3>
              <div className="member-role">{member.role}</div>
              <div className="member-stats">
                <p><span className="stat-label">Strength:</span> {member.strength}</p>
                <p><span className="stat-label">Speed:</span> {member.speed}</p>
                <p><span className="stat-label">Special:</span> {member.special_ability}</p>
              </div>
              <div className="card-actions">
                <Link to={`/detail/${member.id}`} className="view-btn">View</Link>
                <Link to={`/edit/${member.id}`} className="edit-btn">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Detail Page Component
function DetailPage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Find member by ID
    const members = getTeamMembers();
    const foundMember = members.find(m => m.id === parseInt(id));
    
    if (foundMember) {
      setMember(foundMember);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="loading">Loading member details...</div>;
  }

  if (!member) {
    return <div className="error">Member not found. <Link to="/team">Return to team</Link></div>;
  }

  // Handle both camelCase and snake_case for compatibility
  const specialAbility = member.special_ability || member.specialAbility || 'None';

  return (
    <div className="detail-page">
      <h2>{member.name}</h2>
      <div className="member-avatar">
        {member.name.charAt(0)}
      </div>
      <div className="member-details">
        <div className="detail-section">
          <h3>Basic Information</h3>
          <p><strong>Role:</strong> {member.role}</p>
          <p><strong>Strength:</strong> {member.strength}</p>
          <p><strong>Speed:</strong> {member.speed}</p>
          <p><strong>Special Ability:</strong> {specialAbility}</p>
          <p><strong>Created On:</strong> {new Date(member.created_at).toLocaleDateString()}</p>
        </div>
        
        <div className="detail-section">
          <h3>Performance Statistics</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">{calculateEffectiveness(member)}/10</div>
              <div className="stat-name">Effectiveness</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{calculatePower(member)}</div>
              <div className="stat-name">Power Rating</div>
            </div>
          </div>
          <p><strong>Team synergy:</strong> {calculateSynergy(member)}</p>
          <p><strong>Battle style:</strong> {determineBattleStyle(member)}</p>
        </div>
      </div>
      
      <div className="detail-actions">
        <Link to={`/edit/${member.id}`} className="edit-btn">Edit Member</Link>
        <Link to="/team" className="back-btn">Back to Team</Link>
      </div>
    </div>
  );
}

// Additional helper function for detail page
function calculatePower(member) {
  const strengthValues = { Low: 20, Medium: 40, High: 70, Maximum: 100 };
  const speedValues = { Slow: 20, Medium: 40, Fast: 70, Lightning: 100 };
  const abilityValues = { None: 0, Stealth: 20, Flight: 30, Magic: 50, Tech: 40 };
  
  const strengthScore = strengthValues[member.strength] || 30;
  const speedScore = speedValues[member.speed] || 30;
  const abilityScore = abilityValues[member.special_ability || 'None'] || 0;
  
  return strengthScore + speedScore + abilityScore;
}

// Helper functions for additional member details
function calculateEffectiveness(member) {
  const strengthValues = { Low: 2, Medium: 5, High: 8, Maximum: 10 };
  const speedValues = { Slow: 2, Medium: 5, Fast: 8, Lightning: 10 };
  const abilityValues = { None: 0, Stealth: 2, Flight: 3, Magic: 4, Tech: 3 };
  
  // Calculate a score based on attributes
  const baseScore = (strengthValues[member.strength] + speedValues[member.speed]) / 2;
  const specialAbility = member.special_ability || member.specialAbility || 'None';
  const abilityBonus = abilityValues[specialAbility];
  
  return Math.min(Math.round(baseScore + abilityBonus), 10);
}

function calculateSynergy(member) {
  const roleMap = {
    Healer: "High synergy with Tanks and Damage dealers",
    Tank: "High synergy with Healers and Support",
    Damage: "High synergy with Healers and Support",
    Support: "High synergy with all roles",
    Scout: "High synergy with Damage dealers"
  };
  
  return roleMap[member.role] || "Average synergy with the team";
}

function determineBattleStyle(member) {
  if (member.strength === "High" || member.strength === "Maximum") {
    if (member.speed === "Slow" || member.speed === "Medium") {
      return "Powerful but methodical attacks";
    } else {
      return "Aggressive and overwhelming assault";
    }
  } else {
    if (member.speed === "Fast" || member.speed === "Lightning") {
      return "Swift and precise strikes";
    } else {
      return "Strategic and technical approach";
    }
  }
}

// Edit Form Component
function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState({
    role: '',
    strength: '',
    speed: '',
    specialAbility: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const roles = ['Healer', 'Tank', 'Damage', 'Support', 'Scout'];
  const strengthLevels = ['Low', 'Medium', 'High', 'Maximum'];
  const speedLevels = ['Slow', 'Medium', 'Fast', 'Lightning'];
  const specialAbilities = ['None', 'Stealth', 'Flight', 'Magic', 'Tech'];

  useEffect(() => {
    // Find member by ID
    const members = getTeamMembers();
    const foundMember = members.find(m => m.id === parseInt(id));
    
    if (foundMember) {
      setName(foundMember.name);
      setAttributes({
        role: foundMember.role,
        strength: foundMember.strength,
        speed: foundMember.speed,
        specialAbility: foundMember.special_ability || foundMember.specialAbility || 'None'
      });
    } else {
      setError('Member not found');
    }
    setLoading(false);
  }, [id]);

  const handleAttributeChange = (attribute, value) => {
    setAttributes(prev => ({ ...prev, [attribute]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Get current members
      const currentMembers = getTeamMembers();
      
      // Find and update the member
      const updatedMembers = currentMembers.map(member => {
        if (member.id === parseInt(id)) {
          return {
            ...member,
            name,
            role: attributes.role,
            strength: attributes.strength,
            speed: attributes.speed,
            special_ability: attributes.specialAbility,
            updated_at: new Date().toISOString()
          };
        }
        return member;
      });
      
      // Save updated members
      saveTeamMembers(updatedMembers);
      
      // Navigate to detail page
      navigate(`/detail/${id}`);
    } catch (err) {
      console.error('Error updating team member:', err);
      setError('Failed to update team member. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }
    
    try {
      // Get current members
      const currentMembers = getTeamMembers();
      
      // Filter out the member to delete
      const updatedMembers = currentMembers.filter(member => member.id !== parseInt(id));
      
      // Save updated members
      saveTeamMembers(updatedMembers);
      
      // Navigate to team page
      navigate('/team');
    } catch (err) {
      console.error('Error deleting team member:', err);
      alert('Failed to delete team member. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading member data...</div>;
  }

  if (error && error === 'Member not found') {
    return <div className="error">Member not found. <Link to="/team">Return to team</Link></div>;
  }

  return (
    <div className="edit-form">
      <h2>Edit Team Member</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <h3>Role:</h3>
          <div className="attribute-buttons">
            {roles.map(role => (
              <button
                key={role}
                type="button"
                className={attributes.role === role ? 'selected' : ''}
                onClick={() => handleAttributeChange('role', role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <h3>Strength:</h3>
          <div className="attribute-buttons">
            {strengthLevels.map(level => (
              <button
                key={level}
                type="button"
                className={attributes.strength === level ? 'selected' : ''}
                onClick={() => handleAttributeChange('strength', level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <h3>Speed:</h3>
          <div className="attribute-buttons">
            {speedLevels.map(level => (
              <button
                key={level}
                type="button"
                className={attributes.speed === level ? 'selected' : ''}
                onClick={() => handleAttributeChange('speed', level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <h3>Special Ability:</h3>
          <div className="attribute-buttons">
            {specialAbilities.map(ability => (
              <button
                key={ability}
                type="button"
                className={attributes.specialAbility === ability ? 'selected' : ''}
                onClick={() => handleAttributeChange('specialAbility', ability)}
              >
                {ability}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="delete-btn" onClick={handleDelete}>
            Delete Team Member
          </button>
          <Link to={`/detail/${id}`} className="cancel-btn">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default App;