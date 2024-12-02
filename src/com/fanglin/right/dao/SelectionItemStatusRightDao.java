package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.SelectionItemStatusRightPO;

public interface SelectionItemStatusRightDao extends Dao<SelectionItemStatusRightPO> {

	public List<SelectionItemStatusRightPO> querySelectionItemStatusRight(long bid);

	public void deleteSelectionItemStatus(Long bid);
}
