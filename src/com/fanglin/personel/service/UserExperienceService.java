/**
 * Title: UserExperienceService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserExperienceVO;

public interface UserExperienceService {

	public List<UserExperienceVO> queryUserExperienceByUid(UserExperienceVO userExperienceVO) throws FLException;

}
