/**
 * @File Name		: CheckListService.java
 * @Package   	: com.fanglin.inventory.service
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service;

import com.fanglin.core.vo.Filter;

import java.util.List;

import com.fanglin.utils.Paging;

public interface CheckListService {
	
	public void pageCheckList(Paging paging, List<Filter> filters);

}
