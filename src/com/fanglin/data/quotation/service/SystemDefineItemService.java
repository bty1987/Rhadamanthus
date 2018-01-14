/**
 * @File Name		: SystemDefineItemService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.SystemDefineItemVO;
import com.fanglin.utils.Paging;

public interface SystemDefineItemService {
	
	public void pageSystemDefineItem(Paging paging, List<Filter> filters,int company);
	
	public SystemDefineItemVO querySystemDefineItemByItemId(SystemDefineItemVO systemDefineItemVO,int company) throws FLException;
	
	public int addSystemDefineItem(SystemDefineItemVO systemDefineItemVO,int company) throws FLException;
	
	public int updateSystemDefineItem(SystemDefineItemVO systemDefineItemVO) throws FLException;
	
	public int updateSystemDefineItemForStatus(SystemDefineItemVO systemDefineItemVO) throws FLException;
	
	public int updateSystemDefineItemForDiscount(SystemDefineItemVO systemDefineItemVO) throws FLException;
	
	public void deleteSystemDefineItem(SystemDefineItemVO systemDefineItemVO);

	public void deleteSystemDefineItemById(int id);

	public void deleteSystemDefineItemByIds(List<Long> ids);

}
