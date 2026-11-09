package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.sales.vo.SalesOperateVO;
import com.fanglin.sales.vo.SalesVO;

public interface SalesOperateService {

	public List<SalesOperateVO> querySalesOperateBySid(SalesVO salesVO);

}
