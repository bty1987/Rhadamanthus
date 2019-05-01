/**
 * @File Name		: VprizeService.java
 * @Package   	: com.fanglin.information.service
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.VprizeVO;
import com.fanglin.utils.Paging;

public interface VprizeService {
	
	public void pageVprice(Paging paging, List<Filter> filters);
	
	public List<VprizeVO> queryVprize(VprizeVO vprizeVO);
	
	public List<VprizeVO> queryVprizeByNo(String no) throws FLException;
	
	public int addVprize(VprizeVO vprizeVO);
	
	public int updateVprize(VprizeVO vprizeVO) throws FLException;
	
	public int updateVprizeForStatus(VprizeVO vprizeVO) throws FLException;

}
