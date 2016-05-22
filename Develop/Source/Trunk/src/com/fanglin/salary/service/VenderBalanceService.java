/**
 * @File Name		: VenderBalanceService.java
 * @Package   	: com.fanglin.service.salary
 * @Version		: 1.0
 * @Date			: 2014-11-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;

public interface VenderBalanceService {
	
	public void pageVenderBalance(Paging paging, List<FilterVO> filters);
	
	public void pageVenderBalanceForInit(Paging paging, List<FilterVO> filters);
	
	public void pageVenderBalanceForPayOff(Paging paging, List<FilterVO> filters);
	
	public void payVenderBalance();

}
