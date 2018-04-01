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
import com.fanglin.utils.Paging;

public interface UserContractService {
	
	public void pageUserContractByUserId(Paging paging, String userId);
	
	public List<UserContractVO> queryUserContractByUserId(String userId);

    public abstract void saveOrUpdateUserContract(UserContractVO paramUserContractVO);

    public abstract void saveOrUpdateUserContract(List<UserContractVO> paramList);

    public abstract void deleteUserContractById(String paramString);

    public abstract void deleteUserContract(List<String> paramList);
}
