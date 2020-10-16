/**
 * @File Name		: SupplierService.java
 * @Package   	: com.fanglin.personel.service
 * @Version		: 1.0
 * @Date			: 2019-10-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Paging;

public interface SupplierService {

	public void pageSupplier(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<UserVO> querySupplierByPinyin(String pinyin, int company) throws FLException;

	public void addSupplier(UserVO supplier, int company) throws FLException;

	public void updateSupplier(UserVO supplier) throws FLException;

}
