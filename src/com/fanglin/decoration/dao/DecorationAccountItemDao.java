package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationAccountItemPO;

public interface DecorationAccountItemDao extends Dao<DecorationAccountItemPO> {

	public List<DecorationAccountItemPO> queryDecorationAccountItem(String orderId);

	public List<DecorationAccountItemPO> queryDecorationAccountItem(long daid);

	public int deleteDecorationAccountItem(String orderId);

}
