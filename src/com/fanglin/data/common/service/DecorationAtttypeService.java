package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.DecorationAtttypeVO;
import com.fanglin.utils.Paging;

public interface DecorationAtttypeService {

	public void pageDecorationAtttype(Paging paging, List<Filter> filters, int company);

	public List<DecorationAtttypeVO> queryDecorationAtttype(int company);

	public DecorationAtttypeVO queryDecorationAtttype(DecorationAtttypeVO decorationAtttypeVO, int company);

	public void updateDecorationAtttype(long daid, short manageDiscount, short taxDiscount);

}
