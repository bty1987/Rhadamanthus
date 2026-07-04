package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationAuditPO;
import com.fanglin.utils.Paging;

public interface DecorationAuditDao extends Dao<DecorationAuditPO> {

	public List<DecorationAuditPO> pageDecorationAudit(Paging paging, List<Filter> filters, int company);

	public DecorationAuditPO queryDecorationAuditByOrderId(String orderId);

}
