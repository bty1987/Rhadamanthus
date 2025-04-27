package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.SupplierSignetPO;
import com.fanglin.utils.Paging;

public interface SupplierSignetDao extends Dao<SupplierSignetPO> {

	public List<SupplierSignetPO> pageSupplierSignet(Paging paging, List<Filter> filters, int company, long suid);

	public List<SupplierSignetPO> querySupplierSignet(Short type, long suid, int company);

	public int countSupplierSignet(String no);

}
