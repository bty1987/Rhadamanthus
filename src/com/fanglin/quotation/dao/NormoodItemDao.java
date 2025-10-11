package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.NormoodItemPO;

public interface NormoodItemDao extends Dao<NormoodItemPO> {

	public List<NormoodItemPO> queryNormoodItem(long qid);

	public NormoodItemPO queryNormoodItem(long sid, long quoteId, long ngid, short type);

	public int amountNormoodItem(long qid, long nid);

	public int countNormoodItem(long sid, short type);

	public int countNormoodItem(long sid, long quoteld, short type);

	public int disableNormoodItem(long qid);

	public int disableNormoodItem(long qid, short type);

	public int disableNormoodItem(long qid, long sid, short type);

	public int disableNormoodItem(long qid, long sid, long quoteId, short type);

	public int deleteNormoodItem(long qid, short type);

	public int deleteNormoodItem(long qid, short type, short status);

	public int deleteNormoodItem(long qid, long sid, short type);

	public int deleteNormoodItem(long qid, long sid, long quoteId, short type);

}
