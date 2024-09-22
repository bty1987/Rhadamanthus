package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.OalesPayOO;
import com.fanglin.sales.po.OalesPayPO;
import com.fanglin.sales.vo.OalesPayVO;
import com.fanglin.utils.Paging;

public interface OalesPayDao extends Dao<OalesPayPO> {

	public List<OalesPayOO> pageOalesPay(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<OalesPayPO> queryOalesPay(OalesPayVO oalesPayVO);

	public int countOalesPayByOid(Long oid);

}
