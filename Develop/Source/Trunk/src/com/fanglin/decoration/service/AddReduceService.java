/**
 * @File Name		: AddReduceService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.utils.Paging;

public interface AddReduceService {
	
	public void pageAddReduce(Paging paging, List<FilterVO> filters);
	
	public void pageAddReduceByOrderId(Paging paging, List<FilterVO> filters, AddReduceVO addReduceVO);
	
	public List<AddReduceVO> queryAddReduceByOrderId(String orderId);
	
	public int saveOrUpdateAddReduce(AddReduceVO addReduceVO);
	
	public void updateAddReduce(AddReduceVO addReduceVO);
	
	public void deleteAddReduceById(int addReduceId);
	
	public void deleteAddReduce(AddReduceVO addReduceVO);
	
	public String deleteAddReduce(List<Integer> arIds);
	
}
