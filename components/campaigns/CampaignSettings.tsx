import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Save,
  Settings,
  Clock,
  Users,
  Mail,
  Shield,
  AlertTriangle,
  Calendar,
  Target,
  Edit,
  Trash2
} from 'lucide-react'

interface CampaignSettingsProps {
  campaign: any
}

export function CampaignSettings({ campaign }: CampaignSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
    dailyLimit: campaign?.dailyLimit || 20,
    weeklyLimit: campaign?.weeklyLimit || 100,
    timeZone: campaign?.timeZone || 'UTC',
    workingHours: {
      start: campaign?.workingHours?.start || '09:00',
      end: campaign?.workingHours?.end || '17:00'
    },
    workingDays: campaign?.workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    autoStop: campaign?.autoStop || false,
    targetAudience: campaign?.targetAudience || '',
    tags: campaign?.tags || []
  })

  const handleSave = () => {
    // Save campaign settings
    console.log('Saving campaign settings:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: campaign?.name || '',
      description: campaign?.description || '',
      dailyLimit: campaign?.dailyLimit || 20,
      weeklyLimit: campaign?.weeklyLimit || 100,
      timeZone: campaign?.timeZone || 'UTC',
      workingHours: {
        start: campaign?.workingHours?.start || '09:00',
        end: campaign?.workingHours?.end || '17:00'
      },
      workingDays: campaign?.workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      autoStop: campaign?.autoStop || false,
      targetAudience: campaign?.targetAudience || '',
      tags: campaign?.tags || []
    })
    setIsEditing(false)
  }

  const workingDaysOptions = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Campaign Settings</h2>
          <p className="text-sm text-gray-600">
            Configure your campaign parameters and automation rules
          </p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Settings
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter campaign name"
              />
            ) : (
              <p className="text-gray-900">{formData.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            {isEditing ? (
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter campaign description"
                rows={3}
              />
            ) : (
              <p className="text-gray-900">{formData.description || 'No description provided'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            {isEditing ? (
              <Textarea
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="Describe your target audience"
                rows={2}
              />
            ) : (
              <p className="text-gray-900">{formData.targetAudience || 'Not specified'}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Automation Limits */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Automation Limits</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Connection Limit
            </label>
            {isEditing ? (
              <Input
                type="number"
                value={formData.dailyLimit}
                onChange={(e) => setFormData({ ...formData, dailyLimit: parseInt(e.target.value) })}
                min="1"
                max="100"
              />
            ) : (
              <p className="text-gray-900">{formData.dailyLimit} connections per day</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Maximum connections to send per day
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weekly Connection Limit
            </label>
            {isEditing ? (
              <Input
                type="number"
                value={formData.weeklyLimit}
                onChange={(e) => setFormData({ ...formData, weeklyLimit: parseInt(e.target.value) })}
                min="1"
                max="500"
              />
            ) : (
              <p className="text-gray-900">{formData.weeklyLimit} connections per week</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Maximum connections to send per week
            </p>
          </div>
        </div>
      </Card>

      {/* Schedule Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Schedule Settings</h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              {isEditing ? (
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.timeZone}
                  onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              ) : (
                <p className="text-gray-900">{formData.timeZone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              {isEditing ? (
                <Input
                  type="time"
                  value={formData.workingHours.start}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    workingHours: { ...formData.workingHours, start: e.target.value }
                  })}
                />
              ) : (
                <p className="text-gray-900">{formData.workingHours.start}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              {isEditing ? (
                <Input
                  type="time"
                  value={formData.workingHours.end}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    workingHours: { ...formData.workingHours, end: e.target.value }
                  })}
                />
              ) : (
                <p className="text-gray-900">{formData.workingHours.end}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Days
            </label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {workingDaysOptions.map((day) => (
                  <label key={day.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.workingDays.includes(day.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            workingDays: [...formData.workingDays, day.key]
                          })
                        } else {
                          setFormData({
                            ...formData,
                            workingDays: formData.workingDays.filter(d => d !== day.key)
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{day.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.workingDays.map((day) => (
                  <Badge key={day} variant="outline" className="capitalize">
                    {day}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Safety & Compliance */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Safety & Compliance</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Auto-stop when limits reached</h4>
              <p className="text-sm text-gray-600">
                Automatically pause campaign when daily/weekly limits are reached
              </p>
            </div>
            {isEditing ? (
              <input
                type="checkbox"
                checked={formData.autoStop}
                onChange={(e) => setFormData({ ...formData, autoStop: e.target.checked })}
                className="h-4 w-4"
              />
            ) : (
              <Badge className={formData.autoStop ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {formData.autoStop ? 'Enabled' : 'Disabled'}
              </Badge>
            )}
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">LinkedIn Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Keep connection requests personal and relevant</li>
              <li>• Respect daily connection limits (20-30 per day recommended)</li>
              <li>• Avoid spammy or overly promotional content</li>
              <li>• Follow LinkedIn's Terms of Service</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      {!isEditing && (
        <Card className="p-6 border-red-200">
          <div className="flex items-center mb-4">
            <Trash2 className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h4 className="font-medium text-red-900">Delete Campaign</h4>
              <p className="text-sm text-red-600">
                Permanently delete this campaign and all associated data
              </p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Campaign
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
