package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.vo.OutsourceItemVO;
import com.fanglin.production.vo.OutsourceVO;

public interface OutsourceItemService {
	
	public List<OutsourceItemVO> pageOutsourceItemByOid (OutsourceItemVO outsourceItemVO );
	
	public void addOutsourceItem (OutsourceItemVO outsourceItem,OutsourceVO outsource) throws FLException;
	
	public int deleteOutsourceItem(OutsourceItemVO outsourceItem) throws FLException;

}
