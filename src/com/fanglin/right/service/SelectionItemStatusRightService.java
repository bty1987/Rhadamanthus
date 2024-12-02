package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.SelectionItemStatusRightVO;

public interface SelectionItemStatusRightService {

	public List<SelectionItemStatusRightVO> querySelectionItemStatusRight(SelectionItemStatusRightVO selectionItemStatusRights);

	public void updateSelectionItemStatusRight(SelectionItemStatusRightVO selectionItemStatusRightVO, List<SelectionItemStatusRightVO> selectionItemStatusRights);

}
