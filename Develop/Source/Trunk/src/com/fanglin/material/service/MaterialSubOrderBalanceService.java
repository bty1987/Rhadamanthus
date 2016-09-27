/**
 * @File Name		: MaterialSubOrderBalanceService.java
 * @Package   	: com.fanglin.material.service
 * @Version		: 1.0
 * @Date			: 2016-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface MaterialSubOrderBalanceService {
	
	public void pageMaterialSubOrderBalance(Paging paging, List<FilterVO> filters);

}
