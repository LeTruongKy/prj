// Mock data for fallback when API is unavailable
export const mockActivities = {
  data: [
    {
      activity_id: 1001,
      title: 'Tình nguyện vệ sinh môi trường',
      description: 'Participate in community environmental cleanup initiative along Ninh Kieu waterfront.',
      category: {
        category_id: 1,
        name: 'Tình nguyện',
        color: '#4CAF50',
      },
      unit: {
        unit_id: 2,
        name: 'Chi hội sinh viên Tân Hoà',
      },
      location: 'Tôn Đức Thắng Park',
      start_time: '2026-03-15T08:00:00Z',
      end_time: '2026-03-15T12:00:00Z',
      max_participants: 50,
      status: 'PUBLISHED',
      registration_count: 32,
      created_at: '2026-02-18T09:30:00Z',
      approved_by: {
        user_id: '550e8400-e29b-41d4-a716-556655440099',
        fullName: 'Trần Quốc An',
      },
      approved_at: '2026-02-18T10:00:00Z',
    },
    {
      activity_id: 1002,
      title: 'Workshop: React & Next.js',
      description: 'Learn modern web development with React and Next.js. Hands-on workshop for beginners.',
      category: {
        category_id: 2,
        name: 'Học thuật',
        color: '#2196F3',
      },
      unit: {
        unit_id: 2,
        name: 'Chi hội sinh viên Tân Hoà',
      },
      location: 'Room 301, Building A',
      start_time: '2026-03-20T09:00:00Z',
      end_time: '2026-03-20T12:00:00Z',
      max_participants: 40,
      status: 'PUBLISHED',
      registration_count: 28,
      created_at: '2026-02-19T10:00:00Z',
    },
    {
      activity_id: 1003,
      title: 'Football Championship 2026',
      description: 'Annual university football championship with teams from all departments.',
      category: {
        category_id: 4,
        name: 'Thể thao',
        color: '#FF5722',
      },
      unit: {
        unit_id: 2,
        name: 'Chi hội sinh viên Tân Hoà',
      },
      location: 'University Sports Stadium',
      start_time: '2026-03-25T08:00:00Z',
      end_time: '2026-04-10T18:00:00Z',
      max_participants: 500,
      status: 'PUBLISHED',
      registration_count: 250,
      created_at: '2026-02-20T11:00:00Z',
    },
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 3,
    totalPages: 1,
  },
}

export const mockUser = {
  user_id: '550e8400-e29b-41d4-a716-556655440001',
  email: 'student@ctu.edu.vn',
  fullName: 'Nguyễn Văn A',
  studentCode: 'SV2024001',
  unitId: 2,
  unitName: 'Chi hội sinh viên Tân Hoà',
  role: 'STUDENT',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanA',
  major: 'Software Engineering',
  status: 'ACTIVE',
  createdAt: '2026-01-15T10:30:00Z',
}

export const mockLoginResponse = {
  message: 'Login successfully',
  accessToken: 'mock_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi01NTY2NTU0NDAwMDEiLCJlbWFpbCI6InN0dWRlbnRAY3R1LmVkdS52biIsImZ1bGxOYW1lIjoiTmd1eW7Hitm7biDDiiBuIEEifQ.mock_signature',
  user: mockUser,
}

export const mockCategories = {
  data: [
    {
      category_id: 1,
      name: 'Tình nguyện',
      color: '#4CAF50',
      activityCount: 12,
    },
    {
      category_id: 2,
      name: 'Học thuật',
      color: '#2196F3',
      activityCount: 8,
    },
    {
      category_id: 3,
      name: 'Văn nghệ',
      color: '#FF9800',
      activityCount: 5,
    },
    {
      category_id: 4,
      name: 'Thể thao',
      color: '#FF5722',
      activityCount: 15,
    },
  ],
}

export const mockCriteria = {
  data: [
    {
      group_id: 1,
      groupName: 'Đạo đức tốt',
      groupDescription: 'Moral and ethical excellence',
      criteria: [
        {
          criteria_id: 101,
          name: 'Không vi phạm pháp luật',
          description: 'No legal violations or misconduct',
        },
        {
          criteria_id: 102,
          name: 'Tham gia ≥2 hoạt động tình nguyện',
          description: 'Participate in at least 2 volunteer activities',
          requiredActivities: 2,
        },
      ],
    },
    {
      group_id: 2,
      groupName: 'Học tập tốt',
      groupDescription: 'Academic achievement',
      criteria: [
        {
          criteria_id: 201,
          name: 'GPA ≥ 3.0',
          description: 'Minimum cumulative GPA',
        },
      ],
    },
  ],
  total: 5,
}

export const mockUserProfile = {
  user_id: '550e8400-e29b-41d4-a716-556655440001',
  email: 'student@ctu.edu.vn',
  fullName: 'Nguyễn Văn A',
  studentCode: 'SV2024001',
  major: 'Software Engineering',
  unitId: 2,
  unitName: 'Chi hội sinh viên Tân Hoà',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanA',
}

export const mockActivityHistory = [
  {
    registration_id: 1,
    activity_id: 1001,
    activity_title: 'Tình nguyện vệ sinh môi trường',
    registered_date: '2026-02-18T09:30:00Z',
    status: 'VERIFIED' as const,
    registration_status_id: 4,
    check_in_time: '2026-03-15T08:15:00Z',
    proof_url: 'https://example.com/proof1.jpg',
  },
  {
    registration_id: 2,
    activity_id: 1002,
    activity_title: 'Workshop: React & Next.js',
    registered_date: '2026-02-19T10:00:00Z',
    status: 'REGISTERED' as const,
    registration_status_id: 1,
  },
  {
    registration_id: 3,
    activity_id: 1003,
    activity_title: 'Football Championship 2026',
    registered_date: '2026-02-20T11:00:00Z',
    status: 'REGISTERED' as const,
    registration_status_id: 1,
  },
  {
    registration_id: 4,
    activity_id: 1001,
    activity_title: 'Beach Cleanup Day',
    registered_date: '2026-01-15T14:30:00Z',
    status: 'VERIFIED' as const,
    registration_status_id: 4,
    check_in_time: '2026-01-20T08:00:00Z',
    proof_url: 'https://example.com/proof2.jpg',
  },
  {
    registration_id: 5,
    activity_id: 1002,
    activity_title: 'Python Programming Bootcamp',
    registered_date: '2026-02-05T09:00:00Z',
    status: 'PENDING' as const,
    registration_status_id: 3,
  },
]

export const mockRecommendations = [
  {
    activity_id: 1005,
    title: 'Hackathon - Software Development',
    category: {
      category_id: 2,
      name: 'Học thuật',
      color: '#2196F3',
    },
    start_time: '2026-03-20T08:00:00Z',
    match_score: 87,
    match_reason: 'High interest in coding and tech',
    registration_count: 42,
    max_participants: 50,
  },
  {
    activity_id: 1006,
    title: 'UI/UX Design Workshop',
    category: {
      category_id: 2,
      name: 'Học thuật',
      color: '#2196F3',
    },
    start_time: '2026-03-25T14:00:00Z',
    match_score: 75,
    match_reason: 'Complements your software development interests',
    registration_count: 28,
    max_participants: 40,
  },
  {
    activity_id: 1007,
    title: 'Environmental Awareness Seminar',
    category: {
      category_id: 1,
      name: 'Tình nguyện',
      color: '#4CAF50',
    },
    start_time: '2026-03-22T02:00:00Z',
    match_score: 68,
    match_reason: 'Matches your sustainability interests',
    registration_count: 35,
    max_participants: 100,
  },
  {
    activity_id: 1008,
    title: 'Basketball Tournament',
    category: {
      category_id: 4,
      name: 'Thể thao',
      color: '#FF5722',
    },
    start_time: '2026-04-01T08:00:00Z',
    match_score: 62,
    match_reason: 'Popular activity among your peers',
    registration_count: 45,
    max_participants: 80,
  },
]
