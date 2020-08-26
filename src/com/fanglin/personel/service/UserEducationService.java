/**
 * Title: UserContractService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.personel.vo.UserEducationVO;

public interface UserEducationService {
	
	public List<UserEducationVO> queryUserEducation(UserEducationVO userEducationVO);
	
	public int addUserEducation(UserEducationVO userEducationVO);
	
	public int updateUserEducation(UserEducationVO userEducationVO);
	
	public int deleteUserEducation(UserEducationVO userEducationVO);

}
