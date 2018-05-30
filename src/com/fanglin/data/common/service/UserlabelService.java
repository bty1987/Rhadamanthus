package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.data.common.vo.UserlabelVO;


public interface UserlabelService {

	public void updatelabelling(UserlabelVO userlabelVO, List<Integer> lids);
	
	public List<UserlabelVO> querylabelByuid(UserlabelVO userlabelVO);
	
	public List<UserlabelVO> queryUserlabel();
	
	public void sevalabelling(UserlabelVO userlabelVO);
	
	public void deletelabelling(UserlabelVO userlabelVO);
	
	public List<UserlabelVO> queryUserLbaelBylids(List<Integer> lids);
	
	public List<UserlabelVO> queryUserLabelByUidValue(UserlabelVO userlabelVO);
	
}
