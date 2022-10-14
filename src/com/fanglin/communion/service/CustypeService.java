/**
 * @File Name		: BrandService.java
 * @Package   	: com.fanglin.data.service
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.CustypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustypeService {

	public void pageCustype(Paging paging, List<Filter> filters, int company);

	public CustypeVO queryCustype(CustypeVO custype, int company);

	public void addCustype(CustypeVO custype, int company) throws FLException;

	public void updateCustype(CustypeVO custype) throws FLException;

}
