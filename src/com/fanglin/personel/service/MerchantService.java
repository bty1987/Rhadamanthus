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

public interface MerchantService {

	public void pageMerchant(Paging paging, List<Filter> filters) throws FLException;

	public List<UserVO> queryMerchantByPinyin(String pinyin) throws FLException;

}
