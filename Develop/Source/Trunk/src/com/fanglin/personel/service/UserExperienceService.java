/**
 * Title: UserExperienceService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 */

package com.fanglin.personel.service;

import com.fanglin.utils.Paging;

public interface UserExperienceService {
	
	public void pageUserExperienceByUserId(Paging paging, String userId);
	
}
