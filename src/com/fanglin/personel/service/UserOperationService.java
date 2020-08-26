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

import com.fanglin.personel.vo.UserOperationVO;

public interface UserOperationService {
	
	public List<UserOperationVO> queryUserOperation(UserOperationVO userOperationVO);
	
	public int addUserOperation(UserOperationVO userOperationVO);
	
	public int updateUserOperation(UserOperationVO userOperationVO);
	
	public int deleteUserOperation(UserOperationVO userOperationVO);

}
