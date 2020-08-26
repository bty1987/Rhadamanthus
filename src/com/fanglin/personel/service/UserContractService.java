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

import com.fanglin.personel.vo.UserContractVO;

public interface UserContractService {
	
	public List<UserContractVO> queryUserContract(UserContractVO userContractVO);
	
	public int addUserContract(UserContractVO userContractVO, int company);
	
	public int updateUserContract(UserContractVO userContractVO);
	
	public int deleteUserContract(UserContractVO userContractVO);
}
