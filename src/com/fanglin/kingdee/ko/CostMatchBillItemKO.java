package com.fanglin.kingdee.ko;

import java.io.Serializable;

import com.fanglin.utils.Arith;

public class CostMatchBillItemKO implements Serializable {

	private static final long serialVersionUID = 7532848331071482941L;
	
	private float FMatchAMOUNTFOR; //核销金额

	public CostMatchBillItemKO() {
		super();
	}

	public float getFMatchAMOUNTFOR() {
		return FMatchAMOUNTFOR;
	}

	public void setFMatchAMOUNTFOR(float fMatchAMOUNTFOR) {
		FMatchAMOUNTFOR = fMatchAMOUNTFOR;
	}

	public CostMatchBillItemKO(float fMatchAMOUNTFOR) {
		super();
		FMatchAMOUNTFOR = (float) Arith.div(fMatchAMOUNTFOR, 1000.0);
	}

}
