/**
 * Title: UserContractService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.personel.vo.UserContractVO;
import com.fanglin.utils.Paging;

public interface UserContractService {
	
	public void pageUserContractByUserId(Paging paging, String userId);
	
	public List<UserContractVO> queryUserContractByUserId(String userId);

}
