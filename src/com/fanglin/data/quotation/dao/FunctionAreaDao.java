/**
 * @File Name		: QuotationVersionDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.utils.Paging;

public interface FunctionAreaDao extends Dao<FunctionAreaPO> {

	public List<FunctionAreaPO> pageFunctionArea(Paging paging, List<Filter> filters, int company);

	public List<FunctionAreaPO> queryFunctionArea(String versionId);

	public FunctionAreaPO queryFunctionArea(String functionAreaId, String versionId);

	public int countFunctionAreaByFunctionAreaType(String functionAreaType);

}
